export class A1 {
  constructor() {}
}
export class A2 {
  constructor(private a1: A1) {}
}
export class A3 {
  constructor(private a1: A1, private a2: A2) {}
}
