import random
import string

def generate_otp(length=4):
    otp = ''.join(random.choices(string.digits, k=length))
    return otp
