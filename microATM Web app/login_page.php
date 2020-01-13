<?php
session_start();
$con=mysqli_connect("localhost","root","","microatm");
if(!$con){
 die('Could not Connect My Sql:' .mysql_error());
}
if(isset($_POST['login_btn'])){
	$phone=$_POST['phone'];
	$password=$_POST['password'];
    $query="select * from register where phone='$phone' and password='$password'";
    
    $result=mysqli_query($con,$query);
    while($row = $result->fetch_assoc()) 
    {
        echo $row['balance'];
    }
	if(mysqli_num_rows($result)==1)
	{
		header("Location:index.html");
  }
	else
    {
        echo "<script>alert('Wrong Phone no / password')</script>";
        echo "<script>window.open('login.php','_self')</script>";
    }
}   

?>

<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="">
  </head>
  <body>
    <form action="action_page.php" method="post">
  
      <img src="assets/img/author.png" alt="Avatar" style="width:200px; border-radius: 50%; margin: 30% 30% 10% 30%;">
      <div class="text" style="font-family: Work Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 150%;
      line-height: 28px;
      text-align: center;
      color: #000000;
      margin-bottom:30%;">
        Micro ATM
      </div>
      
        <div class="container" style="text-align: center;">
          <label for="phone"><h>Mobile No.</h2></label><br>
          <input type="number" placeholder="Enter Phone Number" name="phone" required>
      <br>
      <br>

          <label for="psw"><b>Password</b></label><br>
          <input type="password" placeholder="Enter Password" name="psw" required>
      <br>
      <br>
          <button type="submit">Login</button>
          
        </div>
      
        </div>
      </form> 
    <script src="" async defer></script>
  </body>
</html>