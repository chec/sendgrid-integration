module.exports = async function handler(request, context) {
  console.log('Running integration', request.body);
  return {
    statusCode: 200,
    body: JSON.stringify(await context.merchant()),
  };
}
