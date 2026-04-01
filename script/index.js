
const cereateElements=(arr)=>{
  const htmlElements = arr.map(el=>`<span class="btn">${el}</span>`);
 return htmlElements.join("");
};


//speaker word sound
function pronounceWord(word) { 
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}





const manageSpinner=(status)=>{
     if(status==true){
       document.getElementById("spinner").classList.remove("hidden");
       document.getElementById("word-container").classList.add("hidden");
     }
     else{
           document.getElementById("word-container").classList.remove("hidden");
       document.getElementById("spinner").classList.add("hidden");
     }
}







const loadLessons =()=>{
    fetch("https://openapi.programming-hero.com/api/levels/all")//promise of response
    .then((res)=> res.json()) //promise of json data 
    .then((json)=>displayLesson(json.data))
};

const removerActive=()=>{
  const lessonButtons= document.querySelectorAll(".lesson-btn");
  // console.log(lessonButtons);
  lessonButtons.forEach((btn)=>btn.classList.remove("active"));
};



const loadLevelWord =(id)=>{
 manageSpinner(true);
    const url=`https://openapi.programming-hero.com/api/level/${id}` ;
    
    fetch(url)
    .then(res=>res.json())
    .then((data)=>{
      removerActive(); //remove all active class
     
     const clickBtn = document.getElementById(`lesson-btn-${id}`);
      // console.log(clickBtn);
      clickBtn.classList.add("active"); //add active class
      displayLevelWord(data.data);
    });
};

// {
//     "word": "Cautious",
//     "meaning": "সতর্ক",
//     "pronunciation": "কশাস",
//     "level": 2,
//     "sentence": "Be cautious while crossing the road.",
//     "points": 2,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "careful",
//         "alert",
//         "watchful"
//     ],
//     "id": 3
// }





const loadWordDetail=async(id)=>{
  const url =`https://openapi.programming-hero.com/api/word/${id}`;
  
  const res = await fetch(url);
  const details = await res.json();
   displayWordDetails(details.data);
};





const displayWordDetails = (word)=>{
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML=`
    <div class="">  
            <h2 class="2xl font-bold">${word.word} ( <i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
        </div>
        <div class="">  
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
        </div>
        <div class="">  
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
        </div>
        <div class="">  
            <h2 class="font-bold">Synonym</h2>
            <div class="">${cereateElements(word.synonyms)}</div>
        </div>
`;
  document.getElementById("word_modal").showModal();
};




const displayLevelWord=(words)=>{
  const wordContainer =document.getElementById("word-container");
  wordContainer.innerHTML="";

  if(words.length == 0){
     wordContainer.innerHTML=`
      
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
        <img class="mx-auto" src="./assets/alert-error.png">
                <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
         </div>
     `;
     manageSpinner(false);
    return;
  }

//   {
//     "id": 19,
//     "level": 1,
//     "word": "Sincere",
//     "meaning": "সত্‍ / আন্তরিক",
//     "pronunciation": "সিনসিয়ার"
// }






  words.forEach(word=>{
    console.log(word);
    const card= document.createElement("div");
    card.innerHTML=`
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word:"শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>

            <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning: "অর্থ পাওয়া যায়নি" } / ${word.pronunciation ? word.pronunciation:"Pronounciation পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>

        </div>
    `;
    wordContainer.append(card);
  });
  manageSpinner(false);
};


const displayLesson=(Lessons)=>{
//   1.get the container and empty
const levelContainer = document.getElementById("Level-container");
//empty container
levelContainer.innerHTML="";

//   2. get into every lessons
for(let lesson of Lessons){
   //  3.create Element 
//    console.log(lesson);
   const btnDiv = document.createElement("div");
   btnDiv.innerHTML=`
    <button  id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-circle-question"></i>Lesson ${lesson.level_no}</button>
   `;
//  4.append into container
  levelContainer.append(btnDiv) ;  
}
   
};



loadLessons();

document.getElementById("btn-search").addEventListener("click",()=>{
     removerActive();
     const input =document.getElementById("input-search");
     const searchValue = input.value.trim().toLowerCase(); //trim()---> ey function e dara string er 1st r end er extra space kate 
     console.log(searchValue);


     fetch("https://openapi.programming-hero.com/api/words/all")
     .then((res)=>res.json())
     .then(data=>{
      const allWords = data.data;
      console.log(allWords);
      const filterWords=allWords.filter(word=>word.word.toLowerCase().includes(searchValue));
      displayLevelWord(filterWords);
     });
})
