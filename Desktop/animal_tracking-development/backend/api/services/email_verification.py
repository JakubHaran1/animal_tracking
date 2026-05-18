from base64 import urlsafe_b64decode, urlsafe_b64encode
from binascii import Error as BinasciiError
import json
from urllib import error, request

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner
from rest_framework.exceptions import ValidationError

User = get_user_model()
_signer = TimestampSigner(salt="api.email-verification")


def _decode_token(token: str) -> str:
    padding = "=" * (-len(token) % 4)
    decoded = urlsafe_b64decode((token + padding).encode("ascii"))
    return decoded.decode("utf-8")


def build_verification_url(token: str) -> str:
    return f"{settings.FRONTEND_URL}/verify-email/{token}"


def generate_email_verification_token(user: User) -> str:
    signed_value = _signer.sign(str(user.pk))
    encoded_value = urlsafe_b64encode(signed_value.encode("utf-8")).decode("ascii")
    return encoded_value.rstrip("=")


def verify_email_token(token: str) -> User:
    try:
        signed_value = _decode_token(token)
        user_id = _signer.unsign(
            signed_value,
            max_age=settings.EMAIL_VERIFICATION_TOKEN_MAX_AGE,
        )
    except (BinasciiError, UnicodeDecodeError, BadSignature, SignatureExpired):
        raise ValidationError({"token": "Token jest nieprawidłowy lub wygasł."})

    user = User.objects.filter(pk=user_id).first()
    if user is None:
        raise ValidationError({"token": "Nie znaleziono użytkownika dla tego tokenu."})

    return user


def send_verification_email(user: User) -> dict:
    token = generate_email_verification_token(user)
    verification_url = build_verification_url(token)

    html = f"""
    <html>
      <body>
        <p>Potwierdź adres e-mail, aby aktywować konto.</p>
        <p><a href="{verification_url}">Potwierdź e-mail</a></p>
        <p>Jeśli przycisk nie działa, wklej ten adres do przeglądarki:</p>
        <p>{verification_url}</p>
      </body>
    </html>
    """

    payload = {
        "from": settings.RESEND_FROM_EMAIL,
        "to": [user.email],
        "subject": "Potwierdź adres e-mail",
        "html": html,
    }

    data = json.dumps(payload).encode("utf-8")

    resend_request = request.Request(
        "https://api.resend.com/emails",
        data=data,
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "animal-tracking/1.0",
        },
        method="POST",
    )
    # If email sending is disabled in settings, return a mocked response
    # with the verification URL to avoid external calls in development.
    if not getattr(settings, "EMAIL_SENDING_ENABLED", False):
        try:
            import logging

            logging.getLogger("api.email_verification").info(
                "Email sending disabled. Verification URL: %s",
                verification_url,
            )
        except Exception:
            pass
        return {"sent": False, "verification_url": verification_url, "mocked": True}

    # Fallback when API key is missing
    if not settings.RESEND_API_KEY:
        import logging

        logging.getLogger("api.email_verification").warning(
            "RESEND_API_KEY not configured; verification URL: %s",
            verification_url,
        )

        return {
            "sent": False,
            "verification_url": verification_url,
            "error": "RESEND_API_KEY missing",
        }
    try:
        with request.urlopen(resend_request, timeout=10) as response:
            response_body = response.read().decode("utf-8", errors="ignore")

        import logging

        logging.getLogger("api.email_verification").info(
            "Verification email sent successfully to %s. Response: %s",
            user.email,
            response_body,
        )

        return {
            "sent": True,
            "verification_url": verification_url,
        }

    except error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="ignore")

        import logging

        logging.getLogger("api.email_verification").error(
            "Resend returned HTTP %s when sending verification email to %s. Body: %s",
            exc.code,
            user.email,
            error_body,
        )

        return {
            "sent": False,
            "verification_url": verification_url,
            "error_code": exc.code,
            "error_body": error_body,
        }

    except error.URLError as exc:
        import logging

        logging.getLogger("api.email_verification").error(
            "Network error while sending verification email to %s. Error: %s",
            user.email,
            str(exc),
        )

        return {
            "sent": False,
            "verification_url": verification_url,
            "error": str(exc),
        }