// TODO: figure out the fetch API
// or at least jQuery.ajax

// callbacks.success(response [json])
// callbacks.failure(errorMessage [string])

// LOG IN

export let logInUser = (username, sessionToken) => {
  window.localStorage.setItem('username', username);
  window.localStorage.setItem('sessionToken', sessionToken);
}


// LOG OUT

export let logOutUser = () => {
  window.localStorage.removeItem('username');
  window.localStorage.removeItem('sessionToken');
}


// GET

let getImpl = (url, headers, callbacks) => {
  jQuery.ajax({
    url: url,
    headers: headers,
  }).done((response) => {
    if (response.error) {
      let errorMessage = `Server responded with: ${JSON.stringify(response.error)}`;
      callbacks.failure(errorMessage);
    } else {
      // console.log('get succeeded :)');
      callbacks.success(response);
    }
  })
  .fail((_jqxhr, _status, error) => {
    let errorMessage = `Request failed due to: ${error}`;
    callbacks.failure(errorMessage);

    if (error === "Unauthorized") {
      logOutUser();
      window.location.reload();
    }
  });
}

export let get = (url, callbacks) => {
  getImpl(url, {}, callbacks);
}

export let authedGet = (url, callbacks) => {
  let token = localStorage.getItem('sessionToken');

  getImpl(url, { 'X-Auth-Token': token }, callbacks);
}


// POST

let postImpl = (url, body, headers, callbacks) => {
  jQuery.ajax({
    type: "POST",
    url: url,
    headers: headers,
    data: body,
  }).done((response) => {
    if (response.error) {
      let errorMessage = `Server responded with: ${JSON.stringify(response.error)}`;
      callbacks.failure(errorMessage);
    } else {
      // console.log('post succeeded :)');
      callbacks.success(response);
    }
  })
  .fail((_jqxhr, _status, error) => {
    let errorMessage = `Request failed due to: ${error}`;
    callbacks.failure(errorMessage);

    if (error === "Unauthorized") {
      logOutUser();
      window.location.reload();
    }
  });
}

export let post = (url, body, callbacks) => {
  postImpl(url, body, {}, callbacks);
}

export let authedPost = (url, body, callbacks) => {
  let token = localStorage.getItem('sessionToken');

  postImpl(url, body, { 'X-Auth-Token': token }, callbacks);
}
