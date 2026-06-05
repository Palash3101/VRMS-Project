from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.db import transaction
from api.serializers import user_serializers

from api.serializers import user_serializers
from api.serializers.vendor_serializers import VendorSerializer

class SignUpView(APIView):
    permission_classes = [] 

    def post(self, request):
        # Extract payloads from your structured request body
        user_data = request.data.get("data")
        vendor_metadata = request.data.get("metadata")

        # 1. Initialize and validate the primary User Serializer
        user_serializer = user_serializers.SignUpSerializer(data=user_data)
        
        if user_serializer.is_valid():
            try:
                # Wrap both database saves in an atomic transaction
                with transaction.atomic():
                    # 2. Save the User row first. This generates the unique 10-char 'userid'
                    user = user_serializer.save()
                    
                    # 3. Check if this registered user requires a secondary vendor row
                    if user.role == 'vendor':
                        if not vendor_metadata:
                            return Response(
                                {"error": "Metadata is required for vendor roles."}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        
                        # 4. Inject the newly generated user ID into the metadata dictionary
                        vendor_metadata["vendorid"] = user.userid
                        
                        # 5. Initialize, validate, and save the Vendor row
                        vendor_serializer = VendorSerializer(data=vendor_metadata)
                        if vendor_serializer.is_valid():
                            vendor_serializer.save()
                        else:
                            # If metadata is invalid, trigger a rollback by returning an error
                            return Response(vendor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # If everything passes inside the atomic block, return the created user data
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return standard validation errors if the basic user data is bad
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
