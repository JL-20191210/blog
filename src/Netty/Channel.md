---
icon: pen-to-square
date: 2025-02-12
category:
  - Netty
tag:
  - 入门
---

# Channel

## 1.连接问题

服务端代码
<!-- more -->
```java
@Slf4j
public class EventLoopServer {
    public static void main(String[] args) {
        DefaultEventLoopGroup group = new DefaultEventLoopGroup();
        new ServerBootstrap()
                .group(new NioEventLoopGroup(),new NioEventLoopGroup(2))
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel nioSocketChannel) throws Exception {
                        nioSocketChannel.pipeline().addLast("handler1",new ChannelInboundHandlerAdapter(){
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                ByteBuf buf = (ByteBuf) msg;
                                log.debug(buf.toString(Charset.defaultCharset()));
                                ctx.fireChannelRead(msg);//让消息传递给下一个handler
                            }
                        }).addLast(group,"handler2",new ChannelInboundHandlerAdapter(){
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                ByteBuf buf = (ByteBuf) msg;
                                log.debug(buf.toString(Charset.defaultCharset()));
                            }
                        });
                    }

                })
                .bind(8080);
    }
}
```

客户端代码

```java
public class TestChannelClient {
    public static void main(String[] args) throws InterruptedException {
        ChannelFuture future = new Bootstrap()
                .group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel nioSocketChannel) throws Exception {
                        nioSocketChannel.pipeline().addLast(new StringEncoder());
                    }
                })
                .connect(new InetSocketAddress("localhost", 8080));
				future.sync();
        Channel channel = future.channel();
        channel.writeAndFlush("hello");
        System.out.println(channel);
    }
}
```

> [!important]
>
> 代码执行到`.connect(new InetSocketAddress("localhost", 8080))`时，主线程调用NIO线程发起连连接。使用`future.sync()`可以阻塞主线程等待NIO线程连接建立完成后进行写入数据操作，如果不使用该方法阻塞主线程就进行数据写入操作，服务器端不会受到消息，简单来说就是水管没有接上就放水，水不会到达目的地。

## 2.处理结果

```java
public class TestChannelClient2 {
    public static void main(String[] args) throws InterruptedException {
        ChannelFuture future = new Bootstrap()
                .group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel nioSocketChannel) throws Exception {
                        nioSocketChannel.pipeline().addLast(new StringEncoder());
                    }
                })
                .connect(new InetSocketAddress("localhost", 8080));
        //方式一：主线程阻塞，同步处理结果
//        future.sync();
//        Channel channel = future.channel();
//        channel.writeAndFlush("hello");
//        System.out.println(channel);

        //方式二：主线程交出控制权，异步处理结果
        future.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture channelFuture) throws Exception {
                Channel channel = future.channel();
                channel.writeAndFlush("hello");
                System.out.println(channel);
            }
        });
        System.out.println("主线程继续运行");
    }
}
```

>:dizzy:方式一同步处理需要主线程等待连接建立，需要主线程进行放水操作。方式二异步处理时主线程将开关交给NIO线程，NIO线程建立连接后自主放水，不占用主线程的时间。

## 3.处理关闭

```Java
@Slf4j
public class ChannelFutureClient {
    public static void main(String[] args) throws InterruptedException {
        NioEventLoopGroup group = new NioEventLoopGroup();
        ChannelFuture future = new Bootstrap()
                .group(group)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel nioSocketChannel) throws Exception {
                        nioSocketChannel.pipeline().addLast(new StringEncoder())
                                .addLast(new LoggingHandler(LogLevel.DEBUG));
                    }
                })
                .connect(new InetSocketAddress("localhost", 8080));

        Channel channel = future.sync().channel();
        new Thread(()->{
            Scanner scanner = new Scanner(System.in);
            while(true){
                String line = scanner.nextLine();
                if(line.equals("q")){
                    log.debug("线程内退出...");
                    channel.close();
                    break;
                }
                channel.writeAndFlush(line);
            }
        },"input").start();
        //1.同步关闭。阻塞主线程，优雅关闭group
        ChannelFuture closeFuture = channel.closeFuture();
//        closeFuture.sync();
//        log.debug("处理关闭之后的操作...");
//        group.shutdownGracefully();

        //2.异步关闭。NIO线程调用平滑关闭
        closeFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture channelFuture) throws Exception {
            log.debug("处理关闭之后的操作...");
                group.shutdownGracefully();
            }
        });
    }
}
```

> :dizzy:与处理结果相同，分为同步处理和异步处理。同步处理阻塞主线程，异步处理由主线程指派给NIO线程执行回调处理
