document.addEventListener("DOMContentLoaded",()=>{
let currentLevel=1;
let currentQues;
let currentHint;
async function getNewWord(id){
        //let response= await fetch(`https://bits-wordle-api.herokuapp.com/words/${id}`);
        let response=await fetch(`http://localhost:3000/words/${id}`,{ mode: 'no-cors' });
        let data=await response.json();
        return data;
    } 
game();    
async function game(){
    let data= await getNewWord(currentLevel++);
    let currentQues=data.word;
    let currentHint=data.hint;
    let hintEl=document.getElementById(hint);
    hint.textContent="Hint: "+currentHint;
    createSquares(currentQues);
    let guessedWords=[[]];
   let availableSpace=1;
    function createSquares(word){
        const gameBoard=document.getElementById("board");
        let string="repeat("+word.length+",1fr)";
        gameBoard.style.gridTemplateColumns = string;
        gameBoard.innerHTML="";
        for (let i = 0; i < (6*word.length); i++) {
            let square=document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id",i+1);
            gameBoard.appendChild(square);            
        }
    }
    
    const keys=document.querySelectorAll(".keyboard-row button");
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick=({ target })=>{
            const letter= target.getAttribute("data-key");
            if(letter==='enter'){
                handleSubmitWord();
                return;
            }
            if(letter==='del'){
                handleDeletion();
                return;
            }
            updateGuessedWords(letter)
        }
        
    }
    function getCurrentWordArr(){
        const numberOfGuessedWords=guessedWords.length;
        return guessedWords[numberOfGuessedWords-1];
    }
    function updateGuessedWords(letter){
        const currentWordArr=getCurrentWordArr();
        if(currentWordArr.length===currentQues.length){
            window.alert("Please click Enter before another guess");
        }
        if(currentWordArr && currentWordArr.length<currentQues.length){
            currentWordArr.push(letter);
            const availableSpaceEl=document.getElementById(String(availableSpace));
            availableSpaceEl.textContent=letter;
            availableSpace=availableSpace+1;
        }
    }

    function getTileColor(letter,index){
        const isCorrectLetter=currentQues.includes(letter);
        if(!isCorrectLetter){
            return "rgb(58,58,60)";
        }
        if(isCorrectLetter && letter===currentQues[index]){
            return "green";
        }
        return "rgb(181,159,59)";
    }

    function handleDeletion(){
        const currentWordArr=getCurrentWordArr();
        if(currentWordArr.length===0){window.alert("No letter to delete");return}
        currentWordArr.pop();
        availableSpace--;
        const availableSpaceEl=document.getElementById(String(availableSpace));
        availableSpaceEl.textContent="";
    }
    function handleSubmitWord(){
        const currentWordArr=getCurrentWordArr();
        if(currentWordArr.length!==currentQues.length){
            window.alert(`Word must be of ${currentQues.length} letters`);
            return;
        }
        const currentWord=currentWordArr.join('');
        //for flipping
        const firstLetterId=(guessedWords.length-1)*currentQues.length+1;
        const interval=200;
        currentWordArr.forEach((letter,index)=>{
            setTimeout(()=>{
                const tileColor=getTileColor(letter,index); 
                const letterId=firstLetterId+index;
                const letterEl=document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style=`background-color:${tileColor};border-color:${tileColor}`; 
            }, interval*index)
        })
        if(currentWord===currentQues){
            window.alert("Congratulations, you are correct !!");
            if(currentLevel===11){window.alert("Thank you! You have completed all the level");return;}
            game();
            return 
        }
        if(guessedWords.length===6){
            window.alert(`Sorry you have no more guesses left! The word is: ${currentQues}`);
            if(currentLevel===11){window.alert("Thank you! You have completed all the levels");return;}
            game();
            return
        }
        guessedWords.push([]);
    }
}
})
