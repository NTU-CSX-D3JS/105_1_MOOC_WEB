load("address_df_all.RData")
a = address_df

i = do.call(cbind.data.frame, a)
head(i)
write.table(i,"address_df_all.csv",sep=',')




