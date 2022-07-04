class O:
    def __init__(self, id):
        self.id = id

def func_b(id: int):
    # do some things
    return id + 55

def func_a(id: int):
    # do some more things
    b = func_b(id)
    return b