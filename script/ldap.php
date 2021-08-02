<?php

echo 'masuk';
if(isset($_POST['username']) && isset($_POST['password'])){

    ldap_set_option(NULL, LDAP_OPT_DEBUG_LEVEL, 7);
    $adServer = "ldap://SKMMHQDC01";

    $ldap = ldap_connect($adServer);
    echo ldap_err2str( ldap_errno($ldap) );
    $username = $_POST['username'];
    $password = $_POST['password'];

    $ldaprdn = 'cmc.gov.my' . "\\" . $username;

    ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
    
    $ldapbind = ldap_bind($ldap);

    if ($ldapbind) {
        echo "LDAP bind anonymous successful...";
    } else {
        echo "LDAP bind anonymous failed...";
    }

    $bind = @ldap_bind($ldap, $username, $password);

    echo ldap_err2str( ldap_errno($ldap) );

    if ($bind) {
        header("Location: http://recceadmin.mcmc.gov.my/#/admin/dashboard"); /* Redirect browser */
        exit();
       
    } else {
        $msg = "Invalid email address / password";
        echo $msg;
        print_r($bind);
    }


}else{
    ?>
        <form action="#" method="POST">
            <label for="username">Username: </label><input id="username" type="text" name="username" /> 
            <label for="password">Password: </label><input id="password" type="password" name="password" />        <input type="submit" name="submit" value="Submit" />
        </form>
    <?php }
?>