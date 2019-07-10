unzip ../processing/jar/core.jar
ls processing/core | while read CLASS; do
    if [[ $CLASS =~ "$" ]];
	then
	echo "$CLASS eliminated"
	else
	echo $CLASS >> core.txt
	fi
done
ls processing/awt | while read CLASS; do
    if [[ $CLASS =~ "$" ]];
    then
    echo "$CLASS eliminated"
    else
    echo $CLASS >> awt.txt
    fi
done
ls processing/data | while read CLASS; do
    if [[ $CLASS =~ "$" ]];
    then
    echo "$CLASS eliminated"
    else
    echo $CLASS >> data.txt
    fi
done
ls processing/event | while read CLASS; do
    if [[ $CLASS =~ "$" ]];
    then
    echo "$CLASS eliminated"
    else
    echo $CLASS >> event.txt
fi
done
ls processing/javafx | while read CLASS; do
    if [[ $CLASS =~ "$" ]];
    then
    echo "$CLASS eliminated"
    else
    echo $CLASS >> javafx.txt
fi
done
ls processing/opengl | while read CLASS; do
    if [[ $CLASS =~ "$" ]];
    then
    echo "$CLASS eliminated"
    else
    echo $CLASS >> opengl.txt
    fi
done
exit 0
