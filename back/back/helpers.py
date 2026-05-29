def generate_custom_userid(n):
    import secrets
    import string

    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(n))