<?php

$name = $_POST['name'];
$email = $_POST['email'];
$msg = $_POST['msg'];
$to = 'mitri.dvp@gmail.com';
// Subject $ Body of E-mail
$subject = "Email enviado por ".$name;
$message = "<html>
            <body>
                <h2>Correo enviado desde - genera.com.co</h2>
                <p>De: '.$name.' - '.$email.'</p>
                <p>Mensaje:<br>'.$msg.'</p>
            </body>
        </html>";
// Headers
$headers = "From: Genera <".$email.">\r\n";
$headers .= "Reply-To: ".$email."\r\n";
$headers .= "MINE-version: 1.0\r\n";
$headers .= "Content-type: text/html";
// Send
mail($to, $subject, $message, $headers);
if(mail($to, $subject, $message, $headers)){
    echo json_encode('Se ha enviado su mensaje!');
} else {
    echo json_encode('Error!');
}; 