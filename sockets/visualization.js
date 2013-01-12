function visualizationRequest() {
  return { hello: 'world' };
}

function visualizationResponse(data) {
  console.log(data);
}

exports.visualizationRequest = visualizationRequest;
exports.visualizationRequest = visualizationResponse;
