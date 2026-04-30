<!DOCTYPE html>
<html>
<head>
    <title>CheckProof for Testing purpose</title>
</head>
<body>
    <h2>Dear Administrator,</h2>
    <div>
        <p>There are a new user signed up.</p>
        <p>
            <ul>
                <li><strong>Name: {{ $user->name }} </strong></li>
                <li><strong>Email: {{ $user->email }} </strong></li>
            </ul>
        </p>
        <p>Please review if necessary</p>
    </div>
    
    <p>Thank you</p>
</body>
</html>