function deleteFetch(userId, callback) {
  fetch(`${userId}`, { method: 'DELETE' })
    //.then((res) => res.json())
    .then((data) => {
      callback(undefined, data);
    })
    .catch((err) => { 
      return callback(err, undefined);
    });
}

function deleteButtonClicked(userId, buttonElement) {
  deleteFetch(userId, (error, results) => {
    if (error) {
      console.log('error', error);
    }
    if (results) {
      //dele row from table in DOM
      console.log('results', results);
    }
  });
}