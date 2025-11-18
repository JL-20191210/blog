# 三个线程顺序打印ABC

```java
class PrintABC {
    private static final Object lock = new Object();  // 用于线程同步的锁对象
    private static int turn = 0;  // 用于控制打印顺序

    // 打印 'a' 的线程
    static class ThreadA extends Thread {
        @Override
        public void run() {
            synchronized (lock) {
                try {
                    while (turn != 0) {
                        lock.wait();  // 等待其他线程先打印
                    }
                    System.out.print("a");
                    turn = 1;  // 更新 turn，让线程 B 打印
                    lock.notifyAll();  // 通知其他线程
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    // 打印 'b' 的线程
    static class ThreadB extends Thread {
        @Override
        public void run() {
            synchronized (lock) {
                try {
                    while (turn != 1) {
                        lock.wait();  // 等待线程 A 打印完
                    }
                    System.out.print("b");
                    turn = 2;  // 更新 turn，让线程 C 打印
                    lock.notifyAll();  // 通知其他线程
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    // 打印 'c' 的线程
    static class ThreadC extends Thread {
        @Override
        public void run() {
            synchronized (lock) {
                try {
                    while (turn != 2) {
                        lock.wait();  // 等待线程 B 打印完
                    }
                    System.out.print("c");
                    turn = 0;  // 更新 turn，让线程 A 打印
                    lock.notifyAll();  // 通知其他线程
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    public static void main(String[] args) {
        // 创建三个线程并启动
        ThreadA threadA = new ThreadA();
        ThreadB threadB = new ThreadB();
        ThreadC threadC = new ThreadC();

        threadA.start();
        threadB.start();
        threadC.start();
    }
}

```

