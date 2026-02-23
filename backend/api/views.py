import re
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Subscription

User = get_user_model()


@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'service': 'muscle-api'})


@ensure_csrf_cookie
@api_view(['GET'])
def csrf(request):
    return Response({})


SERVICES = [
    {'id': 1, 'title': 'Personalized Workouts', 'description': 'Custom routines for strength, conditioning, or both — at home or in the gym.', 'image': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80'},
    {'id': 2, 'title': 'Digital Tools', 'description': 'Access your plan and log workouts from any device. Simple and clear.', 'image': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'},
    {'id': 3, 'title': 'Nutrition Plans', 'description': 'Practical meal guidance that fits your preferences and supports recovery.', 'image': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'},
    {'id': 4, 'title': 'Progress Tracking', 'description': 'Log sets, reps, and measurements. See your progress over time.', 'image': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80'},
]


class ServiceList(APIView):
    def get(self, request):
        return Response(SERVICES)


class ContactCreate(APIView):
    def post(self, request):
        name = request.data.get('name', '')
        email = request.data.get('email', '')
        message = request.data.get('message', '')
        return Response(
            {'message': 'Thank you! We will get back to you soon.'},
            status=status.HTTP_201_CREATED
        )


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'detail': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password)
        login(request, user)
        return Response({
            'message': 'Account created successfully.',
            'user': {'id': user.id, 'email': user.email},
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)
        return Response({
            'message': 'Login successful.',
            'user': {'id': user.id, 'email': user.email},
        }, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # In a real app you would send an email here. For now, we just respond success.
        exists = User.objects.filter(email=email).exists()
        return Response(
            {
                'message': 'If this email exists, a password reset link has been sent.',
                'known_user': exists,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out.'}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'user': {'id': user.id, 'email': user.email},
            'subscription': None,
        }
        try:
            sub = user.subscription
            if sub and sub.status == 'active':
                data['subscription'] = {
                    'plan': sub.plan,
                    'card_last4': sub.card_last4,
                    'phone': sub.phone,
                }
        except Subscription.DoesNotExist:
            pass
        return Response(data)


def _validate_visa(number):
    """Accept Visa: 13 or 16 digits, optionally with spaces/dashes; must start with 4."""
    digits = re.sub(r'\D', '', number)
    return len(digits) in (13, 16) and digits.startswith('4')


def _validate_expiry(expiry):
    """Format MM/YY or MM/YYYY."""
    m = re.match(r'^(\d{1,2})/(\d{2,4})$', expiry.strip())
    if not m:
        return False
    month, year = int(m.group(1)), int(m.group(2))
    if year < 100:
        year += 2000
    return 1 <= month <= 12 and year >= 2025


def _validate_cvv(cvv):
    return re.match(r'^\d{3,4}$', cvv.strip()) is not None


class SubscriptionCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan = (request.data.get('plan') or '').strip().lower()
        if plan not in ('basic', 'pro', 'elite'):
            return Response({'detail': 'Invalid plan.'}, status=status.HTTP_400_BAD_REQUEST)

        card_number = (request.data.get('card_number') or '').strip()
        expiry = (request.data.get('expiry') or '').strip()
        cvv = (request.data.get('cvv') or '').strip()
        phone = (request.data.get('phone') or '').strip()

        if not _validate_visa(card_number):
            return Response({'detail': 'Please enter a valid Visa card number (starts with 4, 13 or 16 digits).'}, status=status.HTTP_400_BAD_REQUEST)
        if not _validate_expiry(expiry):
            return Response({'detail': 'Please enter a valid expiry date (MM/YY or MM/YYYY).'}, status=status.HTTP_400_BAD_REQUEST)
        if not _validate_cvv(cvv):
            return Response({'detail': 'Please enter a valid CVV (3 or 4 digits).'}, status=status.HTTP_400_BAD_REQUEST)
        if not phone:
            return Response({'detail': 'Phone number is required.'}, status=status.HTTP_400_BAD_REQUEST)

        last4 = re.sub(r'\D', '', card_number)[-4:]
        exp_clean = expiry.strip()

        Subscription.objects.filter(user=request.user).delete()
        sub = Subscription.objects.create(
            user=request.user,
            plan=plan,
            status='active',
            card_last4=last4,
            card_expiry=exp_clean,
            phone=phone,
        )
        return Response({
            'message': 'Subscription activated.',
            'subscription': {
                'plan': sub.plan,
                'card_last4': sub.card_last4,
                'phone': sub.phone,
            },
        }, status=status.HTTP_201_CREATED)


class CheckoutView(APIView):
    """Direct checkout: no login required. Email + plan + card → create/find user, create subscription, log in."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        plan = (request.data.get('plan') or '').strip().lower()
        card_number = (request.data.get('card_number') or '').strip()
        expiry = (request.data.get('expiry') or '').strip()
        cvv = (request.data.get('cvv') or '').strip()
        phone = (request.data.get('phone') or '').strip()

        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if plan not in ('basic', 'pro', 'elite'):
            return Response({'detail': 'Invalid plan.'}, status=status.HTTP_400_BAD_REQUEST)
        if not _validate_visa(card_number):
            return Response({'detail': 'Please enter a valid Visa card number (starts with 4, 13 or 16 digits).'}, status=status.HTTP_400_BAD_REQUEST)
        if not _validate_expiry(expiry):
            return Response({'detail': 'Please enter a valid expiry date (MM/YY or MM/YYYY).'}, status=status.HTTP_400_BAD_REQUEST)
        if not _validate_cvv(cvv):
            return Response({'detail': 'Please enter a valid CVV (3 or 4 digits).'}, status=status.HTTP_400_BAD_REQUEST)
        if not phone:
            return Response({'detail': 'Phone number is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=User.objects.make_random_password(length=32),
            )

        last4 = re.sub(r'\D', '', card_number)[-4:]
        exp_clean = expiry.strip()

        Subscription.objects.filter(user=user).delete()
        sub = Subscription.objects.create(
            user=user,
            plan=plan,
            status='active',
            card_last4=last4,
            card_expiry=exp_clean,
            phone=phone,
        )
        login(request, user)
        return Response({
            'message': 'Subscription activated.',
            'user': {'id': user.id, 'email': user.email},
            'subscription': {
                'plan': sub.plan,
                'card_last4': sub.card_last4,
                'phone': sub.phone,
            },
        }, status=status.HTTP_201_CREATED)
