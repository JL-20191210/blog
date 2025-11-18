# 单链表第N个节点转为头结点

## 题目描述

> ```
> 单链表第N个节点转为头结点
> 11->3->5->7->4->1
> 输入3
> 输出：
> 5->7->4->1->11->3
> ```

## 代码示例

```java 
/**
 * @author felix
 * @date 2025/10/28 16:43
 *
 */
public class Algorithm {
    
    // 定义一个单链表节点类
    static class ListNode{
        ListNode next; // 指向下一个节点的指针
        int val;       // 节点的值
        
        // ListNode 构造方法，初始化节点的值，并将 next 指针设置为 null
        ListNode(int val) {
            this.val = val;
            this.next = null;
        }
    }

    /**
     * 将单链表的第 n 个节点提取并放到链表头部
     * @param head 链表的头结点
     * @param n 要提取的节点的索引（从1开始）
     * @return 新的链表头结点
     */
    public static ListNode moveToHead(ListNode head, int n){
        ListNode cur = head;  // 当前节点，初始化为链表的头结点
        ListNode pre = null;  // 前一个节点，初始化为 null
        int count = 1;        // 计数器，用来追踪当前节点的位置
        
        // 遍历链表，找到第 n 个节点
        while(cur != null && count < n){
            pre = cur;         // 更新前一个节点
            cur = cur.next;    // 移动到下一个节点
            count++;           // 计数器加1
        }

        // 如果链表长度小于 n，或者已经是头结点，直接返回原链表
        if(cur == null) return head;
        if(pre == null) return head;

        // 将第 n 个节点移到头部
        ListNode temp = cur;   // 保存第 n 个节点
        pre.next = null;       // 将前一个节点的 next 指针设为 null，断开与第 n 个节点的连接
        
        // 找到第 n 个节点之后的最后一个节点
        while (cur.next != null) cur = cur.next;
        
        // 将第 n 个节点的 next 指针指向原链表头部
        cur.next = head;       
        head = temp;           // 更新头结点为第 n 个节点
        
        return head;           // 返回新的头结点
    }

    /**
     * 主函数，测试代码
     */
    public static void main(String[] args) {
        // 创建一个单链表：11->3->5->7->4->1
        ListNode listNode = new ListNode(11);
        listNode.next = new ListNode(3);
        listNode.next.next = new ListNode(5);
        listNode.next.next.next = new ListNode(7);
        listNode.next.next.next.next = new ListNode(4);
        listNode.next.next.next.next.next = new ListNode(1);

        // 调用 moveToHead 方法，将第 3 个节点提取到头部
        ListNode res = moveToHead(listNode, 3);

        // 打印新的链表
        while (res != null){
            System.out.println(res.val);  // 输出节点的值
            res = res.next;               // 移动到下一个节点
        }
    }
}

```

