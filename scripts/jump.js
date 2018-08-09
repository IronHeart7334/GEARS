function Jump(name, x_mom, y_mom, color){
    this.name = name;
    this.xMom = x_mom;
    this.yMom = y_mom;
    this.color = color;
}
Jump.regular = new Jump("Jump", 1, 1, color3);
Jump.far = new Jump("Leap", 5, 0, color2);
Jump.high = new Jump("Rocket", 1, 5, color1);
