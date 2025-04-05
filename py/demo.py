try :
    def add(a, b):
        return a + b

    a = add(1, 2)
    print(a)
    print ("我叫 %s 今年 %d 岁!" % ('小明',10))
except :
    print("error") 

else: 
    print("没有异常")