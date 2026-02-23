from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'service': 'muscle-api'})


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
