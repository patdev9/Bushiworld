class replaceOnline{

    constructor({ replacements, onComplete }) {
        this.replacements = replacements;
        this.onComplete = onComplete;
      }

      decide() {
        this.menuSubmit(this.replacements[0])
      }
      menuSubmit(replacement) {
        this.keyboardMenu?.end();
        this.onComplete(replacement)
      }

    init(container) {
       
          this.decide();
        
      }
}