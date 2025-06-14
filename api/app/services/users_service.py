import re

def create_user_dentist(name, email, password, cro):
    pass

def create_user_secretary(name, email, password): 
    pass

def create_user_patient(name, email, password, cpf, birth_date, phone):
    pass

def login_user_dentist_secretary():
    pass

def login_user_patient(email_cpf, password):
    if validate_cpf(email_cpf):
        # procurar pelo cpf
        pass
    else:
        # procurar pelo email
        pass

    return {'response': 'success login'}, 201

# esssa função deveria ta aq?
def validate_cpf(cpf: str) -> bool:
    
    if not re.match(r'\d{3}\.\d{3}\.\d{3}-\d{2}', cpf):
        return False

    numbers = [int(digit) for digit in cpf if digit.isdigit()]

    if len(numbers) != 11 or len(set(numbers)) == 1:
        return False

    sum_of_products = sum(a*b for a, b in zip(numbers[0:9], range(10, 1, -1)))
    expected_digit = (sum_of_products * 10 % 11) % 10
    if numbers[9] != expected_digit:
        return False

    sum_of_products = sum(a*b for a, b in zip(numbers[0:10], range(11, 1, -1)))
    expected_digit = (sum_of_products * 10 % 11) % 10
    if numbers[10] != expected_digit:
        return False

    return True