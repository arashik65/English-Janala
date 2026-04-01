const cereateElements=(arr)=>{
  const htmlElements = arr.map(el=>`<span class="btn">${el}</span>`);
  console.log(htmlElements.join(""));
}
const Synonym=["hello","hi","rahim"];
cereateElements(Synonym);