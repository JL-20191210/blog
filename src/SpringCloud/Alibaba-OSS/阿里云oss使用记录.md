# 阿里云oss使用记录

## 原生SDK使用

**product模块导入依赖**

```xml
<!--  阿里云OSS存储原生SDK-->
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.15.0</version>
</dependency>
```

**上传文件**

```java
@Test
    public void testOss(){
        String endpoint = "https://oss-cn-beijing.aliyuncs.com";
        // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
        String accessKeyId = "LTA**********bm9";
        String accessKeySecret = "iA3*********Wg8Ovj";
        // 填写Bucket存储空间名称，例如gulimall。
        String bucketName = "gulimall";
        // 填写存储对象Object完整路径,file为文件夹名，net.jpg为文件名。
        String objectName = "file/net.jpg";
        // 填写本地文件的完整路径。
        // 如果未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件流。
        String filePath= "C:\\Users\\早睡早起\\Pictures\\Saved Pictures\\net.jpg";

        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

        try {
            InputStream inputStream = new FileInputStream(filePath);
            // 创建PutObject请求。
            ossClient.putObject(bucketName, objectName, inputStream);
            System.out.println("上传成功");
        }
        catch (OSSException oe) {
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
        } catch (FileNotFoundException ce) {
            System.out.println("Caught an ClientException, which means the client encountered "
                    + "a serious internal problem while trying to communicate with OSS, "
                    + "such as not being able to access the network.");
            System.out.println("Error Message:" + ce.getMessage());
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
```

## SpringCloud Alibaba-OSS

**common模块引入依赖**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alicloud-oss</artifactId>
</dependency>
```

**配置阿里云** **oss** **相关的账号信息**

```yaml
#application.yml
spring:
	cloud:
		alicloud:
			oss:
				endpoint: oss-cn-beijing.aliyuncs.com
			access-key: xxxxxx
			secret-key: xxxxxx
```

**上传文件**

```java
@Autowired
OSSClient ossClient;

@Test
public void testSpringCloudOss() throws FileNotFoundException {
    InputStream inputStream = new
        FileInputStream("C:\\Users\\早睡早起\\Pictures\\博客封面\\1.png");
    // 填写Bucket存储空间名称，例如gulimall-hello。
    String bucketName = "gulimall-18212";

    ossClient.putObject(bucketName, "file/1.png", inputStream);
    System.out.println("ok");
}
```

