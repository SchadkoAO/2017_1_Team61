/**
 * Created by sergey on 15.04.17.
 */

import {Platform} from './platform';
import {Ball} from './ball';
import {Barrier} from './barrier';
import {Ground} from './ground';
import {Bot} from './bot';

export default class SingleStrategy {

    constructor() {

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.keyboard2 = new KeyboardState();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.spotLight = new THREE.SpotLight( 0xffffff );
        this.spotLight.position.set( 0, 40, 40 );
        this.scene.add(this.spotLight);

        this.y = window.innerHeight * 0.6;
        this.x = this.y * 2.1;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.x, this.y);
        document.body.appendChild(this.renderer.domElement);

        this.pos = { x: 0, y: 0, z: 8 };
        this.size = { width: 16, height: 1, depth: 16 };
        this.ground = new Ground(this.pos, this.size);
        this.scene.add(this.ground.getModel());

        this.barriers = [];

        this.pos = { x: -7.5, y: 1, z: 8 };
        this.size = { width: 1, height: 1, depth: 16 };
        this.angle = Math.PI / 2;
        this.borderLeft = new Barrier(this.pos, this.size, this.angle);
        this.barriers.push(this.borderLeft);
        this.scene.add(this.borderLeft.getModel());

        this.pos = { x: 7.5, y: 1, z: 8 };
        this.size = { width: 1, height: 1, depth: 16 };
        this.angle = Math.PI / 2;
        this.borderRight = new Barrier(this.pos, this.size, this.angle);
        this.barriers.push(this.borderRight);
        this.scene.add(this.borderRight.getModel());

        this.pos = { x: 0, y: 1, z: 15 };
        this.size = { width: 5, height: 1, depth: 1 };
        this.platformMy = new Platform(0, this.pos, this.size);
        this.scene.add(this.platformMy.getModel());

        this.pos = { x: 0, y: 1, z: 1 };
        this.size = { width: 5, height: 1, depth: 1 };
        this.platformEnemy = new Platform(1, this.pos, this.size);
        this.scene.add(this.platformEnemy.getModel());

        this.pos = { x: 0, y: 1, z: 14 };
        this.radius = 0.5;
        this.ball = new Ball(0, this.pos, this.radius);
        this.scene.add(this.ball.getModel());

        this.pos.x = this.platformEnemy.getPosition().x;
        this.pos.y = this.platformEnemy.getPosition().y;
        this.pos.z = this.platformEnemy.getPosition().z;
        this.bot = new Bot(this.pos);


        this.pointViewG = new THREE.SphereGeometry(0, 0, 0);
        this.pointViewM = new THREE.MeshNormalMaterial({ color: 0xffff00 });
        this.pointView = new THREE.Mesh(this.pointViewG, this.pointViewM);
        this.pointView.position.set(0, -4, 2);
        this.scene.add(this.pointView);

        this.camera.position.x = 0;
        this.camera.position.y = 8;
        this.camera.position.z = 20;
        this.look = this.ground.getPosition();
        this.look.y -= 3;
        this.camera.lookAt(this.look);
    }

    render () {

        this.keyboard2.update();

        if (this.keyboard2.pressed('left')) {
            this.control('left');
        }

        if (this.keyboard2.pressed('right')) {
            this.control('right');
        }

        if (this.keyboard2.down('B')) {
            this.control('B');
        }

        if (this.keyboard2.down('space')) {
            this.control('space');
        }

        this.checkMove();

        //
        // if (keyboard2.pressed('A')) {
        //     if (platformEnemy.position.x - platformEnemydes.x / 2 > borderLeft.position.x + borderLeftdes.x / 2) {
        //         platformEnemy.translateX(-0.2);
        //         if (flagMoveBall === false && flagOwn === 2) {
        //             if (ball.position.x >= platformEnemy.position.x + platformEnemydes.x / 2) {
        //                 ball.translateX(-0.2);
        //             }
        //         }
        //     }
        // }
        //
        // if (keyboard2.pressed('D')) {
        //     if (platformEnemy.position.x + platformEnemydes.x / 2 < borderRight.position.x - borderRightdes.x / 2) {
        //         platformEnemy.translateX(0.2);
        //         if (flagMoveBall === false && flagOwn === 2) {
        //             if (ball.position.x <= platformEnemy.position.x - platformEnemydes.x / 2) {
        //                 ball.translateX(0.2);
        //             }
        //         }
        //     }
        // }
        //
        // if (keyboard2.down('B')) {
        //     if(botActive === true) {
        //         botActive = false;
        //     } else {
        //         botActive = true;
        //     }
        // }
        //
        // if (keyboard2.down('space')) {
        //     if (flagMoveBall === false) {
        //         flagMoveBall = true;
        //         vectorMoveBall[0] = (ball.position.x - platformMy.position.x) / 13;
        //         vectorMoveBall[1] = 0;
        //         vectorMoveBall[2] = -((vectorLength ** 2 - vectorMoveBall[0] ** 2) ** 0.5);
        //         time = 0;
        //     }
        // }
        //
        // if (flagMoveBall === true) {
        //     ballCollision();
        //     if(botActive === true) {
        //         if(platformEnemy.position.x - ball.position.x > 0.2) {
        //             if (platformEnemy.position.x - platformEnemydes.x / 2 > borderLeft.position.x + borderLeftdes.x / 2) {
        //                 platformEnemy.translateX(-0.2);
        //             }
        //         } else if (platformEnemy.position.x - ball.position.x < -0.2) {
        //             if (platformEnemy.position.x + platformEnemydes.x / 2 < borderRight.position.x - borderRightdes.x / 2) {
        //                 platformEnemy.translateX(0.2);
        //             }
        //         }
        //     }
        // }
        //
        // ball.translateX(vectorMoveBall[0]);
        // ball.translateY(vectorMoveBall[1]);
        // ball.translateZ(vectorMoveBall[2]);
        //
        // document.getElementsByClassName('score-player1__score')[0].innerHTML = scoreMy;
        // document.getElementsByClassName('score-player2__score')[0].innerHTML = scoreEnemy;
        this.renderer.render(this.scene, this.camera);
    }

    animationScene () {
        this.render();

        window.requestAnimationFrame(this.animationScene.bind(this));
    }

    control (button) {
        if(button === 'left') {
            if(this.platformMy.getPosition().x - this.platformMy.getSize().width / 2 >
                this.borderLeft.getPosition().x + this.borderLeft.getSize().width / 2) {
                this.pos = {
                    x: this.platformMy.getPosition().x - 0.2,
                    y: this.platformMy.getPosition().y,
                    z: this.platformMy.getPosition().z
                };
                this.platformMy.setPosition(this.pos);
                if(this.ball.getMove() === false && this.ball.getSide() === 0) {
                    if(this.ball.getPosition().x > this.platformMy.getPosition().x + this.platformMy.getSize().width / 2) {
                        this.pos = {
                            x: this.platformMy.getPosition().x + this.platformMy.getSize().width / 2,
                            y: this.ball.getPosition().y,
                            z: this.ball.getPosition().z
                        };
                        this.ball.setPosition(this.pos);
                    }
                }
            }
        } else if (button === 'right') {
            if(this.platformMy.getPosition().x + this.platformMy.getSize().width / 2 <
                this.borderRight.getPosition().x - this.borderRight.getSize().width / 2) {
                this.pos = {
                    x: this.platformMy.getPosition().x + 0.2,
                    y: this.platformMy.getPosition().y,
                    z: this.platformMy.getPosition().z
                };
                this.platformMy.setPosition(this.pos);
                if(this.ball.getMove() === false && this.ball.getSide() === 0) {
                    if(this.ball.getPosition().x < this.platformMy.getPosition().x - this.platformMy.getSize().width / 2) {
                        this.pos = {
                            x: this.platformMy.getPosition().x - this.platformMy.getSize().width / 2,
                            y: this.ball.getPosition().y,
                            z: this.ball.getPosition().z
                        };
                        this.ball.setPosition(this.pos);
                    }
                }
            }
        } else if (button === 'B') {
            this.bot.setState(true);
        } else if (button === 'space') {
            if (this.ball.getMove() === false) {
                this.ball.setMove(true);
                this.vector = {x: 0, y: 0, z: 0};
                if(this.ball.getSide() === 0) {
                    this.vector.x = (this.ball.getPosition().x - this.platformMy.getPosition().x) / 13;
                    this.vector.y = 0;
                    this.vector.z = -(this.platformMy.getPosition().z + 2 - this.ball.getPosition().z) / 13;
                } else {
                    this.vector.x = (this.ball.getPosition().x - this.platformEnemy.getPosition().x) / 13;
                    this.vector.y = 0;
                    this.vector.z = -(this.platformEnemy.getPosition().z - 2 - this.ball.getPosition().z) / 13;
                }
                this.ball.setVectorMove(this.vector);
            }
        }
    }

    checkMove () {
        if(this.ball.getMove() === true) {
            if(this.ball.getPosition().x - this.ball.getSize() < this.borderLeft.getPosition().x + this.borderLeft.getSize().width / 2 ||
                this.ball.getPosition().x + this.ball.getSize() > this.borderRight.getPosition().x - this.borderRight.getSize().width / 2) {
                this.vector.x = -this.ball.getVectorMove().x;
                this.vector.y = this.ball.getVectorMove().y;
                this.vector.z = this.ball.getVectorMove().z;
                this.ball.setVectorMove(this.vector);
            } else if (this.ball.getPosition().x >= this.platformMy.getPosition().x - this.platformMy.getSize().width / 2 &&
                this.ball.getPosition().x <= this.platformMy.getPosition().x + this.platformMy.getSize().width / 2 &&
                this.ball.getPosition().z + this.ball.getSize() >= this.platformMy.getPosition().z - this.platformMy.getSize().height / 2) {
                this.vector.x = (this.ball.getPosition().x - this.platformMy.getPosition().x) / 13;
                this.vector.y = 0;
                this.vector.z = -(this.platformMy.getPosition().z + 2 - this.ball.getPosition().z) / 13;
                this.ball.setVectorMove(this.vector);
            } else if (this.ball.getPosition().x >= this.platformEnemy.getPosition().x - this.platformEnemy.getSize().width / 2 &&
                this.ball.getPosition().x <= this.platformEnemy.getPosition().x + this.platformEnemy.getSize().width / 2 &&
                this.ball.getPosition().z - this.ball.getSize() <= this.platformEnemy.getPosition().z + this.platformEnemy.getSize().height / 2) {
                this.vector.x = (this.ball.getPosition().x - this.platformEnemy.getPosition().x) / 13;
                this.vector.y = 0;
                this.vector.z = -(this.platformEnemy.getPosition().z - 2 - this.ball.getPosition().z) / 13;
                this.ball.setVectorMove(this.vector);
            }
            if (this.ball.getPosition().z > this.ground.getGoalMy()) {
                this.ball.setSide(0);
                this.ball.setMove(false);
                this.pos = {
                    x: this.ground.getPosition().x,
                    y: this.platformMy.getPosition().y,
                    z: this.platformMy.getPosition().z
                };
                this.platformMy.setPosition(this.pos);
                this.pos = {
                    x: this.platformMy.getPosition().x,
                    y: this.ball.getPosition().y,
                    z: this.platformMy.getPosition().z - this.platformMy.getSize().height / 2 - this.ball.getSize()
                };
                this.vector.x = 0;
                this.vector.y = 0;
                this.vector.z = 0;
                this.ball.setVectorMove(this.vector);
                this.ball.setPosition(this.pos);
            } else if (this.ball.getPosition().z < this.ground.getGoalEnemy()) {
                this.ball.setSide(1);
                this.ball.setMove(false);
                this.pos = {
                    x: this.ground.getPosition().x,
                    y: this.platformEnemy.getPosition().y,
                    z: this.platformEnemy.getPosition().z
                };
                this.platformEnemy.setPosition(this.pos);
                this.pos = {
                    x: this.platformEnemy.getPosition().x,
                    y: this.ball.getPosition().y,
                    z: this.platformEnemy.getPosition().z + this.platformEnemy.getSize().height / 2 + this.ball.getSize()
                };
                this.vector.x = 0;
                this.vector.y = 0;
                this.vector.z = 0;
                this.ball.setVectorMove(this.vector);
                this.ball.setPosition(this.pos);
            }
            this.pos = {
                x: this.ball.getPosition().x + this.ball.getVectorMove().x,
                y: this.ball.getPosition().y + this.ball.getVectorMove().y,
                z: this.ball.getPosition().z + this.ball.getVectorMove().z
            };
            this.ball.setPosition(this.pos);
            if(this.bot.getState() === true) {
                this.enemyMove = this.bot.getBehavior(this.ball.getPosition());
                this.pos = {
                    x: this.platformEnemy.getPosition().x + this.enemyMove.xd,
                    y: this.platformEnemy.getPosition().y + this.enemyMove.yd,
                    z: this.platformEnemy.getPosition().z + this.enemyMove.zd
                };
                if(this.enemyMove.xd > 0 && this.pos.x + this.platformEnemy.getSize().width / 2 < this.borderRight.getPosition().x -
                    this.borderRight.getSize().width / 2) {
                    this.platformEnemy.setPosition(this.pos);
                    this.bot.setPosition(this.platformEnemy.getPosition());
                } else if (this.enemyMove.xd < 0 && this.pos.x - this.platformEnemy.getSize().width / 2 > this.borderLeft.getPosition().x +
                    this.borderLeft.getSize().width / 2) {
                    this.platformEnemy.setPosition(this.pos);
                    this.bot.setPosition(this.platformEnemy.getPosition());
                }
            }
        }
    }
}

