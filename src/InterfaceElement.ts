export default interface InterfaceElement {
    getSprite(): Phaser.Physics.Arcade.Sprite
    disableInteractive():void;
    setInteractive():void;
    setDepth(depth:number):void;
}