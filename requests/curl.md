```bash
# Successful registration
curl -X POST -H "Content-Type: application/json" \
-d '{"username":"johndoe","email":"john.doe@email.com","password":"password1234"}' \
http://localhost:3000/register
# try register again with the same email to see if it fails
```

```bash
# login with valid credentials
curl -X POST -H "Content-Type: application/json" \
-d '{"login":"john.doe@email.com","password":"password1234"}' \
http://localhost:3000/login
```

```bash
# login with invalid credentials
curl -X POST -H "Content-Type: application/json" \
-d '{"login":"john.doe@email.com","password":"wrong-password"}' \
http://localhost:3000/login
```
