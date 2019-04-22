# I wrote this script because my server box is puny and couldn't handle parsing
# the entire JMdict XML in one go.
# And also because I just learned perl for work and I would hate for that to
# have been a waste

use strict;
use warnings;

my $input_filename = "JMdict_san";
my $output_filename = "temp_JMdict_san";

open FILE, $input_filename or die $!;
open OUTFILE, "> $output_filename" or die $!;

# there's 181913 entries total
my $entry_counter = 0;
my $entries_per_file = 18200;

print "Beginning to parse $input_filename\n";

# The beginning of the input file is full of crap we don't need
while (<FILE>) {
	if ($_ eq "<entry>\n") {
		# Need to append this to make it valid JMdict XML
		print OUTFILE "<JMdict>\n";
		print OUTFILE "<entry>\n";
		last;
	}
}

while (<FILE>) {
  print OUTFILE $_;

  if ($_ eq "</entry>\n") {
    $entry_counter += 1;

    if ($entry_counter >= $entries_per_file) {
      print OUTFILE "</JMdict>\n";
      close OUTFILE;
			
			print "inserting $entry_counter entries into the db\n";
			`node populate_db.js $output_filename`;

      open OUTFILE, "> $output_filename" or die $!;
      print OUTFILE "<JMdict>\n";
      $entry_counter = 0;
    }
  }
}

print OUTFILE "</JMdict>\n";
close OUTFILE;

print "inserting $entry_counter entries into the db\n";
`node populate_db.js $output_filename`;
`rm $output_filename`;
