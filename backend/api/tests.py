from unittest.mock import patch

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from api.services import generate_email_verification_token

User = get_user_model()


class UserEmailVerificationTests(APITestCase):
    def setUp(self):
        self.register_payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "StrongPass123!",
            "confirm_password": "StrongPass123!",
        }

    @patch("api.views.UserViews.send_verification_email")
    def test_register_creates_unverified_user_and_sends_email(self, mocked_send_email):
        response = self.client.post("/api/users/", self.register_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(username="testuser")
        # In development new users are marked verified by default.
        self.assertTrue(user.is_verified)
        mocked_send_email.assert_called_once_with(user)
        self.assertIn("detail", response.data)

    def test_login_is_blocked_for_unverified_user(self):
        User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            "/api/users/login/",
            {"username": "testuser", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("zweryfikowane", str(response.data.get("detail", "")))

    @patch("api.views.UserViews.send_verification_email")
    def test_verify_email_token_activates_user(self, _mocked_send_email):
        self.client.post("/api/users/", self.register_payload, format="json")
        user = User.objects.get(username="testuser")
        token = generate_email_verification_token(user)

        response = self.client.post(
            "/api/users/verify-email/",
            {"token": token},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_verified)

        login_response = self.client.post(
            "/api/users/login/",
            {"username": "testuser", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", login_response.data)

    def test_verify_email_rejects_invalid_token(self):
        response = self.client.post(
            "/api/users/verify-email/",
            {"token": "invalid-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("token", response.data)


class ChangePasswordTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="passworduser",
            email="pw@example.com",
            password="OldPass123!",
        )
        self.user.is_verified = True
        self.user.save(update_fields=["is_verified"])
        self.client.force_authenticate(user=self.user)
        self.url = "/api/users/change-password/"

    def test_change_password_success(self):
        payload = {
            "current_password": "OldPass123!",
            "new_password": "NewPass123!",
            "confirm_new_password": "NewPass123!",
        }

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewPass123!"))
        self.assertFalse(self.user.check_password("OldPass123!"))

    def test_change_password_rejects_wrong_current(self):
        payload = {
            "current_password": "WrongPass123!",
            "new_password": "NewPass123!",
            "confirm_new_password": "NewPass123!",
        }

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("current_password", response.data)

    def test_change_password_rejects_mismatch(self):
        payload = {
            "current_password": "OldPass123!",
            "new_password": "NewPass123!",
            "confirm_new_password": "NewPass123",
        }

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("confirm_new_password", response.data)

    def test_change_password_rejects_weak_password(self):
        payload = {
            "current_password": "OldPass123!",
            "new_password": "short",
            "confirm_new_password": "short",
        }

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("new_password", response.data)
