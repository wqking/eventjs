#!/usr/bin/perl
use strict;
use warnings;

&doMain;

sub doMain
{
	if(scalar(@ARGV) == 0) {
		return;
	}
	
	my $fileName = $ARGV[0];

	open FH, $fileName or die "Can't read $fileName.\n";
	my $content = join('', <FH>);
	close FH;
	
	my %wordToReplace = ();
	
	while($content =~ /\b_([\w\d_]+)\b/msg) {
		$wordToReplace{'_' . $1} = 1;
	}
	
	my $index = 0;
	foreach my $key (keys %wordToReplace) {
		$wordToReplace{$key} = &doGetReplacer($index);
		++$index;
		#print $key, " ", $wordToReplace{$key}, "\n";
	}
	
	foreach my $key (keys %wordToReplace) {
		my $replacer = $wordToReplace{$key};
		$content =~ s/\b$key\b/$replacer/msg;
	}

	open FH, '>' . $fileName or die "Can't write $fileName.\n";
	print FH $content;
	close FH;
}

sub doGetReplacer
{
	my ($index) = @_;
	my @letters = ('a'..'z', 'A'..'Z');
	my $count = scalar(@letters);
	my $result = '_';
	
	do {
		$result .= $letters[$index % $count];
		$index = int($index / $count);
	} while($index > 0);
	
	return $result;
}
