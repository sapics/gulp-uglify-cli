var testData = {
  codeArray: ['/*comments*/', 'console.log', '(', ' 1 ' ,')']
}

testData.code = testData.codeArray.join('')
testData.minifiedCode = testData.codeArray.slice(1).join('').replace(/\s/g, '')
testData.minifiedCodeWithComments = testData.code.replace(/\s/g, '')

module.exports = testData
