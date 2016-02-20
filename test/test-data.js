var testData = {
  codeArray: ['console.log', '(', ' 1 ' ,')']
}

testData.code = testData.codeArray.join('')
testData.minifiedCode = testData.code.replace(/\s/g, '')

module.exports = testData
