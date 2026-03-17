from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def testPage(request):
    return HttpResponse("Test123")
