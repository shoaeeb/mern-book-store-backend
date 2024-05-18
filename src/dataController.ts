import fs from "fs";
import path from "path";

const bookData = fs
  .readFileSync(path.join(__dirname, "data", "bookData.json"))
  .toString();

const writeFile = async () => {
  const jsonData = JSON.parse(bookData);
  let genre = jsonData.flatMap((book: any) => book.genre);
  let set = new Set(genre);
  let uniqueGenre = Array.from(set);
  console.log(uniqueGenre);
  fs.writeFileSync(
    path.join(__dirname, "data", "genre.json"),
    JSON.stringify(uniqueGenre)
  );
};

writeFile();
