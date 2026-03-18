from django.shortcuts import render
from django.http import HttpResponse


def testPage(request):
    return HttpResponse("Test123")
