const app = require("express")();
const fs = require("fs");
const stringSimilarity = require("string-similarity");

app.get("/", async(req, res) => {
   res.json({message: "Sim and teach api by Jonell Magallanes😆"});
});

app.get('/sim', async(req, res, error) => {
  try {
    let path = `./sim.json`;
    let dataa = JSON.parse(fs.readFileSync(path));
    let query = req.query.query;
    let similarities = Object.keys(dataa).map(question => ({
      question,
      similarity: stringSimilarity.compareTwoStrings(query, question)
    }));
    similarities.sort((a, b) => b.similarity - a.similarity); // Sort by similarity

   
    let mostSimilarQuestion = similarities[0].question;
    let dataaa = dataa[mostSimilarQuestion][Math.floor(Math.random() * dataa[mostSimilarQuestion].length)];

    res.json({
      respond: dataaa
    });
  } catch (err) {
    return res.json({
      respond: "I cannot understand your question sorry"
    });
  }
});

app.get('/teach', async(req, res) => {
  let ask = req.query.ask;
  let ans = req.query.ans;
  if (!ask || !ans) return res.json({err: "Missing ans or ask query!"});
  let path = `./sim.json`;
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
  let dataa = JSON.parse(fs.readFileSync(path));
  if (!dataa[ask]) 
    dataa[ask] = [];
  res.json({ask: ask, ans: ans});
  dataa[ask].push(ans);
  fs.writeFileSync(path, JSON.stringify(dataa, null, 4));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
