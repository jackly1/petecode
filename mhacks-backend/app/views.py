import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase import create_client
from django.conf import settings
from tts_martin import text_to_speech
import requests

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Directory to store audio files
AUDIO_DIR = 'audio_files'
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)


@csrf_exempt
def check_user(request):
    if request.method == 'GET':
        token = request.headers.get('Authorization')

        if not token:
            return JsonResponse({'error': 'No token provided.'}, status=401)
        try:
            response = supabase.auth.api.get_user(token)
            if response['user']:
                return JsonResponse({'logged_in': True, 'email': response['user']['email']})
            else:
                return JsonResponse({'logged_in': False, 'error': 'Invalid token.'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)

            # Check if user already exists
            existing_user = supabase.table('users').select('*').eq('email', email).execute()
            if existing_user.data:
                return JsonResponse({'error': 'User already exists.'}, status=400)

            # Create new user
            new_user = supabase.table('users').insert({'email': email, 'password': password}).execute()
            if new_user.status_code == 201:
                return JsonResponse({'message': 'User registered successfully.'}, status=201)
            else:
                return JsonResponse({'error': 'Failed to register user.'}, status=500)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    # If it's not a POST request, return a 405 Method Not Allowed
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required.'}, status=400)

        # Check user credentials
        user = supabase.table('users').select('*').eq('email', email).eq('password', password).execute()
        if user.data:
            token = supabase.auth.api.create_access_token(user.data[0]['id'])
            return JsonResponse({'message': 'Login successful.', 'token': token}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials.'}, status=401)

@csrf_exempt
def submit(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        url = data.get('url')
        user_id = data.get('user_id')

        if not url or not user_id:
            return JsonResponse({'error': 'URL and user_id are required.'}, status=400)

        problem_id, description = get_problem_id(url)
        if problem_id is None:
            return JsonResponse({'error': 'Problem not found for the given URL.'}, status=404)

        # Add problem to user's problems_asked
        supabase.rpc('append_problem_to_user', {
                'user_id': user_id,
                'problem_id': problem_id
            }).execute()

        # Generate audio file
        audio_file_path = text_to_speech(description)

        return JsonResponse({
            'status': 'success',
            'problem_id': problem_id,
            'description': description,
            'audio_file': audio_file_path
        })

def get_problem_id(url):
    response = supabase.table('problems').select('id', 'description').eq('url', url).execute()
    if response.data:
        return response.data[0]['id'], response.data[0]['description']
    return None, None
