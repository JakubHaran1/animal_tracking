from django.apps import AppConfig
import api

class ApiConfig(AppConfig):
    name = 'api'
    def ready(self):
        import api.signals
