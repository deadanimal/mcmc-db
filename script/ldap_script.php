<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data = json_decode($json);

if(isset($data->username) && isset($data->password)){  
    // JSON POST's body must be in string...

    ldap_set_option(NULL, LDAP_OPT_DEBUG_LEVEL, 7);
    $adServer = "ldap://SKMMHQDC01.cmc.gov.my";
 
    $ldap = ldap_connect($adServer);
    //echo ldap_err2str( ldap_errno($ldap) );
    $username = $data->username;
    $password = $data->password;
    // $username = "recceadmin@mcmc.gov.my";
    // $password = "mcmc@123";
    $ldap_password = "mcmc@888";
    $ldap_username = "recceadmin@cmc.gov.my";
 
    // $ldaprdn = 'cmc.gov.my' . "\\" . $username;
 
    ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
    
    $ldapbind = ldap_bind($ldap);
 
    // I COMMENT OUT SINCE WE DONT NEED TO KNOW FOR EVERY BIND REQUEST...
    // if ($ldapbind) {
    //     echo "LDAP bind anonymous successful...<br />";
    // } else {
    //     echo "LDAP bind anonymous failed...<br />";
    // }
 
    $bind = @ldap_bind($ldap, $ldap_username, $ldap_password);
 
    // echo ldap_err2str( ldap_errno($ldap) );
 
    if ($bind) {
      $arr = array('dn', 1);
      $filter="(mail=$username)";
      $result = ldap_search($ldap,"dc=CMC,dc=GOV,dc=MY",$filter, $arr);
      $info = ldap_get_entries($ldap, $result);
      if($info['count'] > 0) {
        if (ldap_bind($ldap,$info[0]['dn'],$password)){
          $data = [ 'success' => 1, 'userId' => 123 ]; 
        }
        else{
          $data = [ 'success' => 1, 'message' => ' bind 3 =Invalid username/password' ];
        }
      }
      else{
          $data = [ 'success' => 1, 'message' => 'bind 2 = Invalid username/password' ];
      }    
    } 
    else {
      $data = [ 'success' => 0, 'message' => 'bind 1 = Invalid username/password' ];
    }
 
    header('Content-Type: application/json');
    // ECHO IS ONCE ONLY SINCE IT WILL RETURN JSON SEKALI SAHAJA ... whichin...
    echo json_encode($data);
    @ldap_close($ldap);      
    exit();
}
else{
  // echo("masuk script else function");
  echo json_encode(array('data' => 'error'));
}
?>