from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

# Create your views here.
def home(request):
    return render(request , 'authentication/index.html')


def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        fname = request.POST['fname']
        lname = request.POST.get('lname')
        email = request.POST.get('email')
        pass1 = request.POST.get('pass1')
        pass2 = request.POST.get('pass2')

        if User.objects.filter(username = username):
            messages.error(request , "User Already Exist")
            redirect('home')

        if User.objects.filter(email = email):
            messages.error(request , "Email already exist")
            redirect('home')

        if len(username) > 10:
            messages.error(request , "Username Could not be more than 10 characters")
        
        if pass1 != pass2:
            messages.error(request , 'Password Doesn\'t match')

        if not username.isalnum():
          messages.error(request, 'Username must be alpha numeric')
          return redirect('home')


          
        myuser = User.objects.create_user(username , email , pass1)
        myuser.first_name = fname
        myuser.last_name = lname
        
        myuser.save()
        messages.success(request , "You have been successfully registered ")

        return redirect('signin')

    return render(request , 'authentication/signup.html')


def signin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        pass1 = request.POST.get('pass1')

        user = authenticate( username = username  , password = pass1)

        if user is not None:
            login(request ,user)
            fname = user.first_name
            return render(request , 'authentication/index.html' , {'fname': fname})
        else :
            messages.error(request , 'Bad Credentials')
            return redirect('home')
    return render(request , 'authentication/signin.html')


def signout(request):
    logout(request)
    messages.success(request ,"Logged Out successfully")
    return redirect('home')



def contact(request):
    return render(request , 'authentication/contactus.html')



def about(request):
    return render(request , 'authentication/aboutus.html')