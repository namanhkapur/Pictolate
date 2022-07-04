class O:
    def __init__(self, id):
        self.id = id

def func_b(id: int):
    # do some things
    return id + 55

def func_a(obj: O):
    # do some more things
    b = func_b(obj)
    return b