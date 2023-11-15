export default function compareTime(t1, t2){ // t1 is the current time & t2 is the chosen time 
    if (t1==null || t2 == null){
        return 3;
    }

    if (t1.getHours() > t2.getHours()){
        return 0; // error
    }
    else if (t1.getHours() < t2.getHours()){
        return 1; // ok
    }
    else{
        if (t1.getMinutes() > t2.getMinutes()){
            return 0;
        }
        else if (t1.getMinutes() < t2.getMinutes()){
            return 1;
        }
        else{
            if (t1.getSeconds() > t2.getSeconds()){
                return 0;
            }
            else if (t1.getSeconds() < t2.getSeconds()){
                return 1;
            }
            else{
                return 2;
            }
        }
    }
}