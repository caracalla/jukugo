// TODO: figure out the fetch API
// or at least jQuery.ajax

// callbacks.success(response [json])
// callbacks.failure(errorMessage [string])
export let get = (url, callbacks) => {
  jQuery.get(url, (response) => {
    if (response.error) {
      let errorMessage = `Server responded with: ${response.error}`;
      callbacks.failure(errorMessage);
    } else {
      callbacks.success(response);
    }
  })
    .fail((_jqxhr, _status, error) => {
      let errorMessage = `Request failed due to: ${error}`;
      callbacks.failure(errorMessage);
    });
}

export let post = (url, body, callbacks) => {
  jQuery.post(url, body, (response) => {
    if (response.error) {
      let errorMessage = `Server responded with: ${response.error}`;
      callbacks.failure(errorMessage);
    } else {
      callbacks.success(response);
    }
  })
    .fail((_jqxhr, _status, error) => {
      let errorMessage = `Request failed due to: ${error}`;
      callbacks.failure(errorMessage);
    });
}
