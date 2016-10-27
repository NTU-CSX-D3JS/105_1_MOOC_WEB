
library("httr")
library("xml2")
library("magrittr")
library("plyr")
library("stringr")
library("doParallel")

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
  tryCatch({all["福利"] = pageweb %>% xml_find_all("//ul[@class='characteristic']/li") %>% xml_text(trim=T) %>% paste(collapse=',')},error=function(e){})
  tryCatch({all["制度"] = pageweb %>% xml_find_all("//div[@class='companyBenefits']/p") %>% xml_text(trim=T)}
           ,error=function(e){})
  all["Map" ] = pageweb %>% xml_find_all("//a[@class='mapIcon thickbox']") %>% xml_attrs %>% extract2(1) %>% extract('onclick') %>% str_extract("[0-9.]+,[0-9.]+") 
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

#file existance
if( file.exists("test.csv") ){
  all = read.csv("test.csv")
}else{
  all = data.frame()
}

#error log
if( file.exists("error.log")) {
  err = readLines(file("error.log"))
  file.remove("error.log")
  for(i in err){
    print(i)
    tryCatch({
      all = rbind.fill(all,jobGet(i))
    },error=function(e){
      write(i,file="error.log",append=TRUE)
    })
  }
}


(cl = (detectCores() - 1) %>%  makeCluster) %>% registerDoParallel
starttime = Sys.time()
for(p in 1:1000){
  urllist =  pageGet(p)
  alltmp = foreach(i = urllist, 
          .combine = rbind.fill,
          .export = "all",
          .packages = c("httr","xml2","magrittr","plyr","stringr")) %dopar%  
          {
            print(i)
            tryCatch({
              return(jobGet(i))
            },error=function(e){
              write(i,file="error.log",append=TRUE)
              #return(e) #debug use
              return(data.frame())
            })
          }
  all = rbind.fill(all,alltmp)
  write.csv(all,"test.csv")
  print(p)
  print(Sys.time()-starttime)
  starttime = Sys.time()
}
stopCluster(cl)




  
