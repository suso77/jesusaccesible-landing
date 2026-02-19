#!/usr/bin/env python3
"""
Backend API Testing for Accessibility Landing Page
Tests the contact form and CV download endpoints
"""

import requests
import json
import os
from datetime import datetime

# Get backend URL from frontend .env
BACKEND_URL = "https://digital-a11y.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

def test_contact_endpoint():
    """Test POST /api/contact endpoint"""
    print("=" * 60)
    print("TESTING CONTACT ENDPOINT")
    print("=" * 60)
    
    # Test data as provided by user
    test_data = {
        "name": "Test Usuario",
        "email": "test@example.com", 
        "phone": "+34 600 123 456",
        "service": "auditoria",
        "message": "Este es un mensaje de prueba para verificar la funcionalidad del formulario de contacto."
    }
    
    print(f"Testing URL: {API_BASE}/contact")
    print(f"Test data: {json.dumps(test_data, indent=2)}")
    
    try:
        # Test valid contact form submission
        response = requests.post(
            f"{API_BASE}/contact",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"\nResponse Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response Body: {json.dumps(response_data, indent=2)}")
            
            # Check response structure
            if "success" in response_data and "message" in response_data:
                if response_data["success"] is True:
                    print("✅ Contact form submission successful")
                    print("✅ Response structure is correct")
                else:
                    print("❌ Success field is not True")
                    return False
            else:
                print("❌ Response missing required fields (success, message)")
                return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response body: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False
    
    # Test email validation
    print("\n" + "-" * 40)
    print("Testing email validation...")
    
    invalid_email_data = test_data.copy()
    invalid_email_data["email"] = "invalid-email"
    
    try:
        response = requests.post(
            f"{API_BASE}/contact",
            json=invalid_email_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Invalid email response status: {response.status_code}")
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Email validation working correctly")
        else:
            print(f"⚠️  Expected 422 for invalid email, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing email validation: {str(e)}")
    
    # Test missing required fields
    print("\n" + "-" * 40)
    print("Testing missing required fields...")
    
    incomplete_data = {"name": "Test", "email": "test@example.com"}  # Missing service and message
    
    try:
        response = requests.post(
            f"{API_BASE}/contact",
            json=incomplete_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Incomplete data response status: {response.status_code}")
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Required field validation working correctly")
        else:
            print(f"⚠️  Expected 422 for missing fields, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing required field validation: {str(e)}")
    
    return True

def test_cv_download_endpoint():
    """Test GET /api/download-cv endpoint"""
    print("\n" + "=" * 60)
    print("TESTING CV DOWNLOAD ENDPOINT")
    print("=" * 60)
    
    print(f"Testing URL: {API_BASE}/download-cv")
    
    try:
        response = requests.get(
            f"{API_BASE}/download-cv",
            timeout=30
        )
        
        print(f"\nResponse Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            # Check Content-Type header
            content_type = response.headers.get('content-type', '').lower()
            print(f"Content-Type: {content_type}")
            
            if 'application/pdf' in content_type:
                print("✅ Correct Content-Type header (application/pdf)")
            else:
                print(f"❌ Incorrect Content-Type. Expected application/pdf, got: {content_type}")
                return False
            
            # Check Content-Disposition header for filename
            content_disposition = response.headers.get('content-disposition', '')
            print(f"Content-Disposition: {content_disposition}")
            
            if 'filename=' in content_disposition:
                print("✅ Filename present in Content-Disposition header")
            else:
                print("⚠️  No filename in Content-Disposition header")
            
            # Check if response contains PDF content
            content_length = len(response.content)
            print(f"Content Length: {content_length} bytes")
            
            if content_length > 0:
                # Check PDF magic bytes
                if response.content.startswith(b'%PDF'):
                    print("✅ Valid PDF file detected")
                    print("✅ CV download endpoint working correctly")
                    return True
                else:
                    print("❌ Response does not contain valid PDF content")
                    return False
            else:
                print("❌ Empty response content")
                return False
                
        elif response.status_code == 404:
            print("❌ CV file not found (404)")
            return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response body: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

def test_api_root():
    """Test basic API connectivity"""
    print("=" * 60)
    print("TESTING API CONNECTIVITY")
    print("=" * 60)
    
    print(f"Testing URL: {API_BASE}/")
    
    try:
        response = requests.get(f"{API_BASE}/", timeout=30)
        print(f"Response Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
            print("✅ API root endpoint accessible")
            return True
        else:
            print(f"❌ API root returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ API connectivity test failed: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print(f"Backend API Testing Started at {datetime.now()}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base URL: {API_BASE}")
    
    results = {
        "api_connectivity": False,
        "contact_endpoint": False,
        "cv_download": False
    }
    
    # Test API connectivity first
    results["api_connectivity"] = test_api_root()
    
    # Test contact endpoint
    results["contact_endpoint"] = test_contact_endpoint()
    
    # Test CV download
    results["cv_download"] = test_cv_download_endpoint()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed!")
        return True
    else:
        print("⚠️  Some tests failed")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)