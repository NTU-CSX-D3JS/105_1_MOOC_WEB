
library("httr")
library("xml2")
library("magrittr")
library("plyr")

webGet = function(page,query=list()){
	url = paste0("http://www.518.com.tw/job-index-P-",toString(page),".html")
	return (GET(url,query=query) %>% content())
}

pageGet = function(pagenum){
  return( webGet(pagenum,query=list(aa="3001001")) %>% xml_find_all("//div[@id='listContent']/*/li[@class='title']/a") %>% 
    xml_attrs %>% lapply( function(x) c(x %>% extract('href'))) %>% unlist %>% unname )
}

jobGet = function(url){
  # ignore case 
  #if(regexpr('case.518',url)[1] > 0)
  #  return(data.frame())
  pageweb = GET(url) %>% content()
  #data
  all = list() 
  all["URL"] = url
  all["內容"] = pageweb %>% xml_find_all("//*[@class='JobDescription']") %>% xml_text(trim=T) 
  all = data.frame(all)  
  
  #base data
  base = pageweb %>% xml_find_all("//*[@class='jobItem']")
  base_title = base %>% xml_find_all("*/dt/text()[1]") %>% xml_text(trim=T) 
  base_text  = base %>% xml_find_all("*/dd/text()[1]") %>% xml_text(trim=T)
  category = grep("職務類別：", base_title) # this may be 5
  base_text[category] = base %>% xml_find_all(paste0("*/dd[",toString(category),"]/a")) %>% xml_text(trim=T) %>% paste(collapse=',')
  alltmp = data.frame(matrix(unlist(base_text), nrow=1, byrow=T))
  names(alltmp) = base_title
  all = cbind(all,alltmp)
  
  #limit
  base = pageweb %>% xml_find_all("//*[@class='job-detail-box']")
  base_title = base %>% xml_find_all("*/dt/text()") %>% xml_text(trim=T) 
  base_text  = base %>% xml_find_all("*/dd") %>% xml_text(trim=T)
  alltmp = data.frame(matrix(unlist(base_text), nrow=1, byrow=T))
  names(alltmp) = base_title
  all = cbind(all,alltmp)
  
  return(all)
}

all = data.frame()
for(p in 1:1000){
  for(i in pageGet(p)){
    print(i)
    tryCatch({
      all = rbind.fill(all,jobGet(i))
    },error=function(e){
      write(i,file="error.log",append=TRUE)
    })
  }
  write.csv(all,"test.csv")
}



  
