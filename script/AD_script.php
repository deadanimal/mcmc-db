<?php

echo 'masuk';

if(isset($_POST['username']) && isset($_POST['password'])){

    ldap_set_option(NULL, LDAP_OPT_DEBUG_LEVEL, 7);
    $adServer = "ldap://SKMMHQDC01.cmc.gov.my";

    $ldap = ldap_connect($adServer);
    echo ldap_err2str( ldap_errno($ldap) );
    $username = $_POST['username'];
    $password = $_POST['password'];

    $ldaprdn = 'cmc.gov.my' . "\\" . $username;

    ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
    $ldap_password = 'mcmc@888';
    $ldap_username = 'recceadmin@cmc.gov.my';
    $ldapbind = ldap_bind($ldap,$ldap_username,$ldap_password);
    $attr = "password";

    if ($ldapbind) {
        // echo "LDAP bind anonymous successful...";
        echo "ldapbind: ".$ldapbind;
        $filter="(sAMAccountName=$username)";
        $result = ldap_search($ldap,"dc=CMC,dc=GOV,dc=MY",$filter);
        echo "result= ".$result;
        ldap_sort($ldap,$result,"sn");
        $info = ldap_get_entries($ldap, $result);
        for ($i=0; $i<$info["count"]; $i++)
        {
            if($info['count'] > 1)
                break;
            echo "<p>You are accessing <strong> ". $info[$i]["sn"][0] .", " . $info[$i]["givenname"][0] ."</strong><br /> (" . $info[$i]["samaccountname"][0] .")</p>\n";
            echo '<pre>';
            var_dump($info);
            echo '</pre>';
            $userDn = $info[$i]["distinguishedname"][0]; 
            
        }
        $r=ldap_compare($ldap, $userDn, $attr, $password);
        echo "compare = ".$r;
        @ldap_close($ldap);
    } else {
        echo "LDAP bind anonymous failed...";
    }

}
?>