#!/usr/bin/perl
use strict;
use warnings;

my %wordToReplace = (
	qr/\s*\@preserve\s*/ => '',
);

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
	
	while($content =~ /\b_([\w\d_]+)\b/msg) {
		my $key = '_' . $1;
		$key = qr/\b$key\b/;
		$wordToReplace{$key} = undef;
	}
	
	my $index = 0;
	foreach my $key (keys %wordToReplace) {
		$wordToReplace{$key} = &doGetReplacer($index) unless defined $wordToReplace{$key};
		++$index;
		#print $key, " ", $wordToReplace{$key}, "\n";
	}
	
	foreach my $key (keys %wordToReplace) {
		my $replacer = $wordToReplace{$key};
		$content =~ s/$key/$replacer/msg;
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
