<?php
/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2013 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold.samples
 * @copyright     Copyright 2011-2013 codeQ e.U.
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha.scaffold 0.5.1
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */



if(empty($HTTP_RAW_POST_DATA) && empty($_POST)) {
	// send the remote api
	exit('
		Ext.ns("Bancha");
		Bancha.REMOTE_API={
		  "url":"direct-api.php",
		  "namespace":"Bancha.RemoteStubs",
		  "type":"remoting",
		  "actions":{
		    "Article":[
		      {
		        "name":"read",
		        "len":1
		      },
		      {
		        "name":"create",
		        "len":1
		      },
		      {
		        "name":"update",
		        "len":1
		      },
		      {
		        "name":"destroy",
		        "len":1
		      },
		      {
		        "name":"submit",
		        "len":1,
		        "formHandler":true
		      }
		    ],
		    "User":[
		      {
		        "name":"read",
		        "len":1
		      },
		      {
		        "name":"create",
		        "len":1
		      },
		      {
		        "name":"update",
		        "len":1
		      },
		      {
		        "name":"destroy",
		        "len":1
		      },
		      {
		        "name":"submit",
		        "len":1,
		        "formHandler":true
		      }
		    ],
		    "Book":[
		      {
		        "name":"read",
		        "len":1
		      }
		    ]
		  }
		};');
}

// sample data
$sample_user_data = json_decode('[
    {
 	    "id":"1",
        "name":"Roland",
        "login":"roland",
        "created":"2011-07-28 03:54:20",
        "email":"mail@rolandschuetz.at",
        "avatar":"img\/user-avatars\/bancha-logo-1.png",
        "weight":"76",
        "height":"187"
    },
    {
        "id":"2",
        "name":"Andreas",
        "login":"andreas",
        "created":"2011-07-28 03:54:20",
        "email":"andreas.kern@gmail.com",
        "avatar":"img\/user-avatars\/bancha-logo-2.jpg",
        "weight":"70",
        "height":"230"
    },
    {
        "id":"3",
        "name":"Florian",
        "login":"florian",
        "created":"2011-07-28 03:54:20",
        "email":"f.eckerstorfer@gmail.com",
        "avatar":"img\/user-avatars\/bancha-logo-1.png",
        "weight":"80",
        "height":"180"
    },
    {
        "id":"4",
        "name":"Kung",
        "login":"kung",
        "created":"2011-07-28 03:54:20",
        "email":"kung.wong@gmail.com",
        "avatar":"img\/user-avatars\/bancha-logo-1.png",
        "weight":"82",
        "height":"186"
    }
]');
$sample_article_data = array();
for($i=0;$i<35;$i++) {
	$sample_article_data[$i] = array(
		'id'    	=> $i,
		'title' 	=> 'Title '.($i+1),
		'body'		=> 'This is the body '.($i+1),
		'date'  	=> '2012-11-'.str_pad($i%30+1,2,'0',STR_PAD_LEFT).' 11:50:34',
		'published' => $i%3==0,
		'user_id'   => $i%4+1
	);
};
$sample_book_data = array();
for($i=0;$i<35;$i++) {
	$sample_book_data[$i] = array(
		'id'    	=> $i,
		'title' 	=> 'Book '.($i+1),
		'published' => $i%3==0,
		'user_id'   => $i%4+1
	);
};

// handle form posts with uploads
if(isset($_POST['extMethod'])) {
	if($_POST['extMethod']!='submit') {
		exit('Error: Could not recodnize the post request');
	}
	// simply return everything, so the client things everything is ok
	// (this is no yet supporting file uploads)
	$response = $_POST; //just symbolic
	// make up an id in the case of an create
	$response['id'] = isset($_POST['id']) ? $_POST['id'] : rand();
	// transform structure for form uploads
	if(isset($_POST['extUpload']) && $_POST['extUpload']=="true") {
		exit('upload');
		$response = '<html><body><textarea>' . json_encode($_POST) . '</textarea></body></html>';
	} else {
		// transform to standard result
		$response = json_encode(array(array(
			'type'   => 'rpc',
			'tid'    => $_POST['extTID'],
			'action' => $_POST['extAction'],
			'method' => $_POST['extMethod'],
			'result' => array(
				'success'=> true,
				'data'   => $response
			)
		)));
	}
	exit($response);
}



// handle XHR requests
$request = json_decode($HTTP_RAW_POST_DATA);
$request = is_array($request) ? $request : array($request); // for single requests

foreach ($request as $key => $data) {
	switch ($data->method) {
		case 'create':
			// make up an id and just send the data back to the user
			$data->data[0]->id = rand();
			$result = array(
				'success' => true,
				'data'    => $data->data
				);
			break;
		case 'read':
			// get the corresponding elemennts
			$entries = $data->action=='User' ? $sample_user_data :
						($data->action=='Article' ? $sample_article_data : $sample_book_data);
			// if there is an id just send one record, otherwise send a paged result
			$selected_entries = isset($data->data[0]->data->id) ? $entries[0] :
					array_slice($entries, $data->data[0]->start, $data->data[0]->limit);

			$result = array(
				'success' => true,
				'data'    => $selected_entries,
				'total'  => count($entries)
				);
			break;
		case 'update':
			// just send the data back to the user
			$result = array(
				'success' => true,
				'data'    => json_encode($data->data)
				);
			break;
		case 'destroy':
			// nothing to do here
			$result = array('success'=>true);
			break;
		default:
			exit('Error: Could not recodnize the request number '.$key);
	}

	// build response msg
	$response[$key] = array(
		'type'   => 'rpc',
		'tid'    => $data->tid,
		'action' => $data->action,
		'method' => $data->method,
		'result' => $result
	);
}

echo json_encode($response);
