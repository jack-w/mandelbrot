#include <stdio.h>
#include <stdlib.h>
#include <math.h>



#define MALLOC( variable, type, size ) \
    do{\
        (variable) = ( type * ) malloc( (size) * sizeof( type ) );\
        if( (variable) == NULL )\
        {\
            fprintf(stderr, "ERROR memory allocation failed\n" );\
            exit(1);\
        }\
        memsize+=(size)*sizeof(type);\
    } while(0)

#define FREE( variable, type, size ) \
    do{\
        free(variable);\
        variable=NULL;\
        memsize-=(size)*sizeof(type);\
    } while(0)

double memsize=0;


int mandelbrot(double ar, double ai)
{
    int counter=0;
    int maxcount=30;
    double threshhold = 4;
    double zr=0, zi=0, zm=0, tmpr, tmpi;

    while(counter<maxcount){
        tmpr = zr;
        tmpi = zi;
        zr = tmpr*tmpr - tmpi*tmpi + ar;
        zi = 2*tmpr*tmpi + ai;
        counter++;
        if( zr*zr + zi*zi > threshhold) break;
    }
//    fprintf(stderr, "%f\n",  zr*zr + zi*zi );
    return counter;
}

int julia(double ar, double ai, double cr, double ci)
{
    int counter=0;
    int maxcount=30;
    double threshhold = 4;
    double zr=ar, zi=ai, zm=0, tmpr, tmpi;

    while(counter<maxcount){
        tmpr = zr;
        tmpi = zi;
        zr = tmpr*tmpr - tmpi*tmpi + cr;
        zi = 2*tmpr*tmpi + ci;
        counter++;
        if( zr*zr + zi*zi > threshhold) break;
    }
//    fprintf(stderr, "%f\n",  zr*zr + zi*zi );
    return counter;
}

int main(int argc, char *argv[])
{
    int n=10000;
    double ar,ai;
    double rlower=-2, rupper=2, ilower=-2, iupper=2;
    double incr=sqrt((rupper-rlower)*(iupper-ilower))/1000;
    double points=(rupper-rlower)*(iupper-ilower)/(incr*incr);
    double percent=0;
    FILE *fout;

    ar = 0.2;
    ai = 0.1;


    fout = fopen("out.dat", "w");
    for (ar = rlower; ar <= rupper; ar += incr) {
        for (ai = ilower; ai <= iupper; ai += incr) {
            percent++;
            n = mandelbrot(ar,ai);
//            n = julia(ar,ai, 0.4, 0.188);
            fprintf(fout, "%f %f %d\n", ar, ai, n);
        }
        fprintf(fout, "\n");
        fprintf(stderr, "%f\n", percent/points);
    }
    fclose(fout);

    return 0;
}
