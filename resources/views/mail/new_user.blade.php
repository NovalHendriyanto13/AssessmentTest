<!DOCTYPE html>
<html>
<head>
    <title>CheckProof for Testing purpose</title>
</head>
<body>
    <h2>Welcome, {{ $user->name }}</h2>
    <div>
        <p>Your account is successfully created.</p>
        <p>Please use your email <strong>{{ $user->email }}</strong> to login and start using the system</p>
    </div>
    
    <p>Thank you</p>
</body>
</html>